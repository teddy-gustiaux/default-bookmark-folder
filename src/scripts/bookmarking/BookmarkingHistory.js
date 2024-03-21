'use strict';

class BookmarkingHistory {
	#history;
	#index = 0;
	#maxEntries = 10_000;
	#isLocked = false;

	constructor() {
		this.#history = {};
	}

	recordBookmark(bookmarkInfo) {
		if (this.#index > this.#maxEntries) {
			Logger.warn('Exceeded maximum number of history records (oldest one will be deleted)');
			delete this.#history[this.#index - this.#maxEntries];
		}
		// We cannot use `bookmarkInfo.dateAdded` because it is the original creation time of the bookmark entry, not the time it is being loaded onto the system.
		const loadedAd = Date.now();
		bookmarkInfo.__DBF__loadedAt = loadedAd;
		this.#history[this.#index] = bookmarkInfo;
		this.#index++;
	}

	#isThisPartOfBatchRecording(indexStart, triggeredAt) {
		let latestRecordedBookmarkTime = this.#history[indexStart].__DBF__loadedAt;
		// Count number of bookmark entries within the 500 ms of the creation time of the entry
		// (either before or after the entry creation event)
		let stepsBack = 1;
		while (latestRecordedBookmarkTime >= triggeredAt - 500) {
			if (!this.#history[indexStart - stepsBack]) break;
			latestRecordedBookmarkTime = this.#history[indexStart - stepsBack].__DBF__loadedAt;
			stepsBack++;
		}
		if (stepsBack > 2 ) {
			return true;
		} else {
			let stepsForward = 1;
			while (latestRecordedBookmarkTime >= triggeredAt - 500) {
				if (!this.#history[indexStart + stepsForward]) break;
				latestRecordedBookmarkTime = this.#history[indexStart + stepsForward].__DBF__loadedAt;
				stepsForward++;
			}
			return stepsForward > 2;
		}

	}

	async processQueue(builtinBookmarking, bookmarkInfo) {
		const triggeredAt = Date.now();
		const indexTriggeredAt = JSON.parse(JSON.stringify(this.#index));

		let indexStart = indexTriggeredAt > 0 ? indexTriggeredAt - 1 : 0;
		if (this.#isThisPartOfBatchRecording(indexStart, triggeredAt)) {
			await builtinBookmarking.skipBookmark(bookmarkInfo, 'batch recording (detected early)')
			return;
		}

		// Let's get a lock before processing.
		// Wait is proportional to queue size after the first 2 recorded items.
		let waitTime = this.#history.length > 2
			? ( Math.log(10) / Math.log(10 + this.#history.length) ) * 100
			: 100;
		if (waitTime > 200) waitTime = 100;
		await Utils.wait(waitTime);
		let loops = 0;
		const maxLoops = 1000;
		while (this.#isLocked && loops < maxLoops) {
			loops++;
			await Utils.wait(5);
		}
		if (loops >= maxLoops) {
			Logger.error('Fail-sage exiting. Queue processing taking too long.');
			return;
		}
		this.#isLocked = true;

		indexStart = this.#index > 0 ? this.#index - 1 : 0;
		try {
			if (this.#isThisPartOfBatchRecording(indexStart, triggeredAt)) {
				await builtinBookmarking.skipBookmark(bookmarkInfo, 'batch recording')
			} else {
				await builtinBookmarking.move(bookmarkInfo.id, bookmarkInfo, false);
			}
		} catch (e) {
			Logger.error(e);
		} finally {
			this.#isLocked = false;
		}
	}
}
