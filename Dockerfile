FROM node:7.1.0
# replace this with your application's default port
EXPOSE 3000

ADD app/ .

CMD ["npm", "start"]

