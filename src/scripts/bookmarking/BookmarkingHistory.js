'use strict';

class BookmarkingHistory {
	#history;
	#index = 0;
	#maxEntries = 1000;
	#isLocked = false;

	constructor() {
		this.#history = new Map();
	}

	recordBookmark(bookmarkInfo) {
		if (this.#index > this.#maxEntries) {
			Logger.warn('Exceeded maximum number of history records (oldest one will be deleted)');
			this.#history.delete(this.#index - this.#maxEntries);
		}
		// We cannot use `bookmarkInfo.dateAdded` because it is the original creation time of the bookmark entry, not the time it is being loaded onto the system.
		const loadedAd = Date.now();
		bookmarkInfo.__DBF__loadedAt = loadedAd;
		this.#history.set(this.#index, bookmarkInfo);
		this.#index++;
	}

	_isThisPartOfBatchRecording(indexStart, triggeredAt) {
		let latestRecordedBookmarkTime = this.#history.get(indexStart).__DBF__loadedAt;
		// Count number of bookmark entries within the 500 ms of the creation time of the entry
		let stepsBack = 1;
		while (latestRecordedBookmarkTime >= triggeredAt - 500) {
			if (!this.#history.get(indexStart - stepsBack)) break;
			latestRecordedBookmarkTime = this.#history.get(indexStart - stepsBack).__DBF__loadedAt;
			stepsBack++;
		}
		return stepsBack > 2;

	}

	async processQueue(builtinBookmarking, bookmarkInfo) {
		const triggeredAt = Date.now();

		// Let's get a lock before processing
		await Utils.wait(100);
		let loops = 0;
		while (this.#isLocked && loops < 1000) {
			loops++;
			await Utils.wait(5);
		}
		if (loops >= 1000) {
			Logger.error('Fail-sage exiting. Queue processing taking too long.');
			return;
		}
		this.#isLocked = true;

		const indexStart = this.#index > 0 ? this.#index - 1 : 0;
		try {
			if (indexStart === 0) {
				await builtinBookmarking._moveBookmarkToDefinedLocation(bookmarkInfo);
			} else {
				if (this._isThisPartOfBatchRecording(indexStart, triggeredAt)) {
					Logger.debug('Skipping this bookmark (reason: batch recording)');
				} else {
					await builtinBookmarking.move(bookmarkInfo.id, bookmarkInfo, false);
				}
			}
		} catch (e) {
			Logger.error(e);
		} finally {
			this.#isLocked = false;
		}
	}
}
