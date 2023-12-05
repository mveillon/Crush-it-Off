# Crushers

This is a party game meant to help people get away from that awkward wondering of whether their crush likes them back. The idea is to get a large group of friends together and each player will select who among those friends the player has a crush on. If the crush selects the player, then they both have a crush on each other, they match, and they should start dating. Simple!

# Installation and Usage

This web app was made with React in Typescript and uses Firebase for cloud storage. The site is also hosted using Firebase, currently at `https://crushers-b9b59.web.app`. To use locally, run `npm i` to install all of the dependencies. Then run `npm start` to launch the development server. This will open a tab in your browser to the home page. You will have to log in with Google. At the moment, only people with Gmail accounts can use this web app. Finally, there are some tests which can be run with `npm test`. Tests should go in the `src/tests/` directory.

# Deployment

Once the app is ready for deployment, run the command `npm run deploy`, which will minify the project and put it in the `build` directory, ready for production. Then, it will deploy the site to the Firebase site where the public can view and use it.
