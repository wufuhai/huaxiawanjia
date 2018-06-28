set root=%cd%
cd ./platforms/android/build/outputs/apk/

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "%root%\app.keystore" -storepass wu541200 android-release-unsigned.apk wanjiajinfu
zipalign -f -v 4 android-release-unsigned.apk kelvinwu.huaxiawanjia.apk

start .

cd %root%
