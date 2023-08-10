# A guide for deploying to Itch.io

If Butler is not already installed locally, install it.
## Install Butler
```bash
# download
# unzip and make executable
# check version
curl -L https://broth.itch.ovh/butler/darwin-amd64/LATEST/archive/default -O ./butler.zip
mkdir butler
mv butler.zip ./butler/butler.zip
unzip ./butler/butler.zip
chmod +x ./butler/butler
./butler/butler -V
```

## Login to Itch.io
```bash
./butler/butler login
```

## zip the build
```bash
zip -r ./builds/itch.zip ./build
```

## Push to Itch.io
```bash
./butler/butler push ./builds/itch.zip classicwook/terminal-world:web
```

## First time setup
After pushing the build, go to the project and mark it as playable in browser.
After this new build will automatically replace the old one.
