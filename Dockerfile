FROM node
# replace this with your application's default port
EXPOSE 3000

ADD app/ .

CMD ["npm", "install"]

CMD ["npm", "start"]

