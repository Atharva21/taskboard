# **Taskboard**

Taskboard is a self hosted service to manage your day-to-day tasks in a organized way.

![taskboard.gif](https://i.postimg.cc/1zQgcQLW/Task-Board-2-1.gif)

## Getting Started

clone the repo `git clone https://github.com/Atharva21/taskboard.git`

-   Backend

    cd into server `cd ./taskboard-server`

    install dependencies

          yarn

    The backend is dependent on redis, and mongodb, we will use docker to get those two running.

        docker run redis -d -p 6379:6379

    ***

        docker run mongo -d -p 27017:27017

    refer to `.env.sample` and create a `.env` file with a `SESSION_SECRET`

    to serve the backend:

        yarn dev

-   Frontend

    cd into client `cd ./taskboard-client`

    install dependencies

        yarn

    serve frontend:

        yarn dev

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
