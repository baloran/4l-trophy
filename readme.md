# 4l Trophy

## Requirements

- NodeJS
- Npm
- Mysql

## Install

```bash
git clone https://github.com/baloran/4l-trophy.git
cd 4l-trophy
npm i
```

### Configure

In the work directory

```bash
mv config/config.json.sample config/config.json
```

After that configure the projet with you current mysql params

```bash
npm install -g sequelize-cli
sequelize db:migrate
```

### Here we go

```bash
npm start # With this or ..
nodemon # If you have npm i -g nodemon
```