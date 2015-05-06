rm ../timulto-build/android/timulto-release-signed.apk
jarsigner -keystore ~/.keystore -sigalg SHA1withRSA -digestalg SHA1 ../timulto-build/android/unaligned.apk timulto
~/.meteor/android_bundle/android-sdk/build-tools/21.0.0/zipalign 4 ../timulto-build/android/unaligned.apk ../timulto-build/android/timulto-release-signed.apk
