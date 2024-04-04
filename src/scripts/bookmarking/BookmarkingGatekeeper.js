'use strict';

class BookmarkingGatekeeper {
	#options;
	#bookmarkingHistory;

	constructor(options, bookmarkingHistory) {
		this.#options = options;
		this.#bookmarkingHistory = bookmarkingHistory;
	}

	async onBookmarksCreated(id, bookmarkInfo) {
		const builtinBookmarking = new BuiltinBookmarking(this.#options);

		if (Utils.bookmarkIsAddonInternal(bookmarkInfo)) {
			await builtinBookmarking.renameBookmark(bookmarkInfo);
		} else {
			// We only want to consider very recent multi-tabs bookmark creation events (within the last second).
			// Otherwise we could process older events which are part of a bookmark import.
			const bookmarkIsMultiTabsSystemCreatedFolder =
				await Utils.bookmarkIsMultiTabsSystemCreatedFolder(bookmarkInfo);
			const bookmarkIsPartOfMultiTabsFolder =
				await Utils.bookmarkIsPartOfMultiTabsFolder(bookmarkInfo);
			const bookmarkIsVeryRecent = bookmarkInfo.dateAdded >= Date.now() - 1000;

			if (
				(bookmarkIsMultiTabsSystemCreatedFolder || bookmarkIsPartOfMultiTabsFolder) &&
				bookmarkIsVeryRecent
			) {
				await builtinBookmarking.move(
					id,
					bookmarkInfo,
					true,
					'multi-tabs bookmark creation event',
				);
			} else {
				this.#bookmarkingHistory.recordBookmark(bookmarkInfo);
				await this.#bookmarkingHistory.processQueue(builtinBookmarking, bookmarkInfo);
			}
		}
	}
}
