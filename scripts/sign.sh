jarsigner -keystore ~/.keystore -digestalg SHA1 ../timulto-build/android/unaligned.apk timulto
~/.meteor/android_bundle/android-sdk/build-tools/21.0.0/zipalign 4 ../timulto-build/android/unaligned.apk ../timulto-build/android/timulto-release-signed.apk
