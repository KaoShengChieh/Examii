Examii
===

## Architecture

**Examii** is developed in **JavaScript**, which mainly leverages [React](https://reactjs.org/), [GraphQL](https://graphql.org/), and [MongoDB](https://www.mongodb.com/2).

![](https://i.imgur.com/ahpDiTq.png)

**Examii** composes the UIs from small and isolated pieces of code in `frontend/src/components` with [React](https://reactjs.org/)'s declarative and flexible JavaScript library. And the program in `frontend/src/containers` controls these components with [React Hooks](https://reactjs.org/docs/hooks-intro.html).

> Although **React** is powerful. We have to admit its notorious incompatibility issues about the version, about the components. No matter whether we’re newbies, or experienced frontend developers, we struggle.

![](https://i.imgur.com/3OxM04l.png)

**Examii** manages the context and data of a client with [GraphQL](https://graphql.org/). It provides APIs and a runtime for fulfilling queries with existing data. One of the most advantages of **GraphQL** is its complete and understandable description of the data in API. 

But, how does the understandable description help? You may find that **Examii** has two servers, frontend and backend. And given the power of **GraphQL**, we can ask for exactly what they need and nothing more. Therefore, **Examii** is made to be easily evolved over time.

![](https://i.imgur.com/P6s3mBl.png)

To communicate between frontend and backend, **Examii**'s servers uses [Apollo](https://www.apollographql.com/) to manage remote data of **GraphQL** on each other. **Apollo** provides a comprehensive state management library for JavaScript. And it also provides [built-in integration with **React**](https://www.apollographql.com/docs/react/).

Last but not least, **Examii** use [MongoDB](https://www.mongodb.com/2) as its [document-oriented database](https://en.wikipedia.org/wiki/Document-oriented_database). Classified as a [NoSQL](https://en.wikipedia.org/wiki/NoSQL) database, MongoDB uses JSON-like documents with optional schemas, which has similar advantage we mentioned in **GraphQL** earlier. These tools help us structure code in an economical, predictable, and declarative way that's consistent with modern development practices. 

[Mongoose](https://mongoosejs.com/) is the last key to  fulfill [publish–subscribe pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) in **Examii**. **Mongoose** supports both promises and callbacks in JavaScript. **Examii** use **Mongoose** to model **MongoDB** object, making it work in an asynchronous environment. 

Although we did not put much emphasis, **Examii** will  synchronize the information by automatically updating client webpage without the need to click refresh button on browser. 

## Development

**Examii** adopts [Yarn](https://yarnpkg.com/) for development and version control.

Before you trying or developing **Examii**, you first need to install **Yarn** on your system. There are many different ways to install it, but the following one is recommended and cross-platform.

### Install Node.js

Install **Yarn** through the [npm package manager](https://www.npmjs.com/), which comes bundled with [Node.js](https://nodejs.org/en/).

* Install the latest stable version of **Node.js**.
    ```shell
    # Using Ubuntu
    $ curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

    # Using Debian, as root
    $ curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    $ apt-get install -y nodejs
    ```

* To install and compile native add-ons from **npm** you also need to install build tools:
    ```shell
    # use `sudo` on Ubuntu or run this as root on debian
    $ apt-get install -y build-essential
    ```

> More Information about installing **Node.js**:
[https://github.com/nodesource/distributions](https://github.com/nodesource/distributions)

### Install Yarn via npm

Once you have npm installed, you can run the following to both **install** and **upgrade** Yarn:

```shell
$ npm install --global yarn
```

---

**Examii** uses [MongoDB Atlas Database](https://www.mongodb.com/cloud/atlas) as its backend database. Given security issue, we did not leave the official URL of **MongoDB** in the repo. Please add a **MongoDB** URL of yours to make a great management of your local build.

### Get a MongoDB

Sign up an account at [MongoDB Atlas Database](https://www.mongodb.com/cloud/atlas).

You will be prompted to create a new [MongoDB Cluster](https://www.mongodb.com/basics/clusters). Just create one according to your demand. Say, you live in the East Coast of US. You may want to choose AWS server in Virginia. Choose **M0 program** (Free) for Cluster Tier, which has provided pretty sufficient resources for most non-commercial applications.

![](https://i.imgur.com/ddIjE4H.png)

It takes a few minutes to create a cluster. You can create users and edit whitelist during this time. Usually, you will add an Admin account (i.e. yourself) for this cluster. The whitelist should include the network domains where your target clients and you locate (e.g. your collage).

![](https://i.imgur.com/WHeHC4v.png)

When it finishs, you can see there is a beautiful dashboard for you to manage your cluster. For now, click **CONNECT** button.

![](https://i.imgur.com/YwWMcgc.png)

Then, click **Connect Your Application**. It generates a URL for you. Copy this URI, and replace its `password` and `dbname` (now you see why we cannot put **MongoDB** URL in our repo). We will use it to connect to **MongoDB**. `dbname` is the name of your database in cluster. You can just name it to be **Examii**.

![](https://i.imgur.com/ExcPmKK.png)

Create a new file `.env` under `Examii/backend` and paste the URL.

``` shell
$ cd Examii/backend
$ echo "MONGO_URL=[mongodb+srv://...]" > .env
```

The backend of **Examii** automatically extracts the `MONGO_URL` variable in `.env` and use it to connect to **MongoDB**.

## Local Build

All preparation is done! Now launch the server and client. You will see **Examii** run at `localhost:3000`. 

### Backend
``` shell
$ cd Examii/backend
$ yarn
$ yarn server
```
### Frontend
``` shell
$ cd Examii/frontend
$ yarn
$ yarn start
```
