# **Taskboard**

![taskboard.gif](https://i.postimg.cc/1zQgcQLW/Task-Board-2-1.gif)

Taskboard is a service to manage your day-to-day tasks in a organized way.

## Setup

clone the repo `git clone https://github.com/Atharva21/taskboard.git`

-   Backend

    cd into server `cd ./taskboard-server`

    install dependencies `yarn`

    The backend is dependent on redis, and mongodb, we will use docker to get those two running.

    `docker run redis -p 6379:6379`

    `docker run mongo -p 27017:27017`

    refer to `.env.sample` and create a `.env` file with a `SESSION_SECRET`

    to serve the backend: `yarn dev`

-   Frontend

    cd into client `cd ./taskboard-client`

    install dependencies `yarn`

    serve frontend: `yarn dev`
