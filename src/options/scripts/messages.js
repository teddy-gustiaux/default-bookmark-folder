'use strict';

/*
 * =================================================================================================
 * MESSAGES
 * =================================================================================================
 */

function closeWelcomeMessage() {
    document.querySelector(WELCOME).classList.remove('is-active');
    browser.storage.local.set({ [NOTIFICATION]: true });
}

async function welcomeMessage() {
    const options = await getOptions();
    if (
        !Object.prototype.hasOwnProperty.call(options, NOTIFICATION) ||
        options[NOTIFICATION] !== true
    ) {
        document.querySelector(CLOSE_WELCOME).addEventListener('click', closeWelcomeMessage);
        document.querySelector(DELETE_WELCOME).addEventListener('click', closeWelcomeMessage);
        document.querySelector(WELCOME).classList.add('is-active');
    }
}
