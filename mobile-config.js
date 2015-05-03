App.info({
  id: 'it.timulto.app',
  name: 'TiMulto',
  description: 'Delazione e senso civico',
  author: 'TiMulto',
  email: 'info@timulto.org',
  website: 'http://www.timulto.org',
  version: '0.0.4'
});

App.launchScreens({
  // Android
  'android_ldpi_portrait': 'resources/splash/splash-480x800.png',
  'android_ldpi_landscape': 'resources/splash/splash-800x480.png',
  'android_mdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_mdpi_landscape': 'resources/splash/splash-800x480.png',
  'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_hdpi_landscape': 'resources/splash/splash-800x480.png',
  'android_xhdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_xhdpi_landscape': 'resources/splash/splash-800x480.png'
});

App.icons({
  'android_ldpi': 'resources/icons/320.png',
  'android_mdpi': 'resources/icons/320.png',
  'android_hdpi': 'resources/icons/320.png',
  'android_xhdpi': 'resources/icons/320.png'
});

App.accessRule(
    "https://api.twitter.com/*",
    {
        launchExternal: false
    }
);

App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');


/*App.accessRule(
    "http://timulto.meteor.com/*",
    {
        launchExternal: false
    }
);*/
/*
320dp: a typical phone screen (240x320 ldpi, 320x480 mdpi, 480x800 hdpi, etc).
480dp: a tweener tablet like the Streak (480x800 mdpi).
600dp: a 7” tablet (600x1024 mdpi).
720dp: a 10” tablet (720x1280 mdpi, 800x1280 mdpi, etc).

App.launchScreens({
  // Android
  'android_ldpi_portrait': 'resources/splash/splash-200x320.png',
  'android_ldpi_landscape': 'resources/splash/splash-320x200.png',
  'android_mdpi_portrait': 'resources/splash/splash-320x480.png',
  'android_mdpi_landscape': 'resources/splash/splash-480x320.png',
  'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_hdpi_landscape': 'resources/splash/splash-800x480.png',
  'android_xhdpi_portrait': 'resources/splash/splash-720x1280.png',
  'android_xhdpi_landscape': 'resources/splash/splash-1280x720.png'
});
*/
