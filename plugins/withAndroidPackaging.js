const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidPackaging(config) {
    return withAppBuildGradle(config, (config) => {
        const contents = config.modResults.contents;

        if (contents.includes('META-INF/versions/9/OSGI-INF/MANIFEST.MF')) {
            return config;
        }

        const packagingBlock = `
    packaging {
        resources {
            excludes += ['META-INF/versions/9/OSGI-INF/MANIFEST.MF']
        }
    }`;

        config.modResults.contents = contents.replace(
            /android\s*\{/,
            `android {${packagingBlock}`
        );

        return config;
    });
};