FROM node:8.5.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./
RUN npm install -g typescript --registry=https://registry.npm.taobao.org
RUN npm install --registry=https://registry.npm.taobao.org

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]