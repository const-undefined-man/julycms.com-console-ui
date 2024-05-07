# 定义变量
ARG NODE_VERSION=16.13.1

# build stage
FROM node:${NODE_VERSION}-alpine AS build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json文件以便安装依赖
COPY package.json ./

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 安装项目依赖
RUN npm install

# 将应用代码复制到容器内
COPY . .

# 运行构建命令
RUN npm run build


# production stage
FROM nginx:stable as production-stage

# 从构建阶段复制构建产物到新的镜像
COPY --from=build-stage /app/dist /usr/share/nginx/html/julycms.com-console-ui
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

# 曝露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
