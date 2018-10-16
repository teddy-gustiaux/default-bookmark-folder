const browser = chrome;

describe('Background utilities', () => {
    it('should return extension options', async () => {
        const options = await Utils.getOptions();
        expect(options).to.be.not.null();
    });

    it('should validate supported protocols', () => {
        expect(Utils.isSupportedProtocol('http://google.com')).to.be.true();
        expect(Utils.isSupportedProtocol('https://google.com')).to.be.true();
    });
});
