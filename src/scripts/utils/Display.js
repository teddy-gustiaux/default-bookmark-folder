'use strict';

class Display {
	// Inserts SVG icons inline
	static insertSvgIcons() {
		const parser = new DOMParser();
		const elementsWithSvgIcon = document.querySelectorAll('[data-svg]');
		Array.from(elementsWithSvgIcon).forEach(async (elementWithSvgIcon) => {
			const svgUrl = browser.runtime.getURL(`${elementWithSvgIcon.dataset.svg}`);
			const response = await fetch(svgUrl);
			const responseData = await response.text();
			const svgImageElement = parser.parseFromString(responseData, 'image/svg+xml');
			const svgInline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svgInline.setAttribute('viewBox', svgImageElement.firstChild.getAttribute('viewBox'));
			Array.from(svgImageElement.children).forEach((child) => svgInline.appendChild(child));
			elementWithSvgIcon.appendChild(svgInline);
		});
	}

	static insertDataFromLocales() {
		document.title = browser.i18n.getMessage('options_title');
		const elementsWithLocale = document.querySelectorAll('[data-locale]');
		Array.from(elementsWithLocale).forEach((element) => {
			if (typeof element.placeholder !== 'undefined') {
				// eslint-disable-next-line no-param-reassign
				element.placeholder = browser.i18n.getMessage(element.dataset.locale);
			} else {
				// eslint-disable-next-line no-param-reassign
				element.textContent = browser.i18n.getMessage(element.dataset.locale);
			}
		});
	}
}
