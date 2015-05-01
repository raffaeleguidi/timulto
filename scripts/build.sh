    # run this script 4from the root of the project
#
# ..>scripts/build.sh
#
# for further information: https://github.com/Differential/meteor-mobile-cookbook/blob/master/Android/Building.md

prod_domain=$1

rm -rf ../timulto-build/android
meteor build --server $prod_domain --directory ../timulto-build --mobile-settings settings.json
