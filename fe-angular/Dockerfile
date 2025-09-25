FROM node:18-alpine AS build

# Setting Fsoft proxy
ENV http_proxy=http://10.134.151.10:8080
ENV https_proxy=http://10.134.151.10:8080
ENV no_proxy=localhost,127.0.0.1,192.168.*.*,*dl.delivery.mp.microsoft.com,logger.foxitcloud.com,sccm-hl-01.fsoft.fpt.vn,sccm-dad-01.fsoft.fpt.vn,upanh1.com,scontent.fsgn6-2.fna.fbcdn.net,stats.g.doubleclick.net,dn-repo.fsoft.com.vn,exmaple.com,10.*.*.*,172.16.*,172.17.*,172.21.*,172.31.*,*fsoft.com.vn,*fsoft.fpt.vn,*.fpt.com.vn,annofab.com,epayment.fpt.com.vn,*ho.fpt.vn*,adfs.fpt.com.vn

# Set working directory
WORKDIR /usr/local/app
COPY ./ /usr/local/app
RUN npm config set strict-ssl false
RUN npm install --force

# RUN npm run build-prod
RUN npm run build

### STAGE 2:RUN ###
FROM nginx:stable-alpine
COPY --from=build /usr/local/app/dist/ /usr/share/nginx/html
COPY nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 4200:80
CMD ["/bin/sh", "-c", \
    "echo HOST_IP=[$HOST_IP], && sed -i s#HOST_IP#$HOST_IP#g /usr/share/nginx/html/main.*.js && exec nginx -g 'daemon off;'"]
# CMD ["/bin/sh", "-c", \
#     "echo HOST_IP=[$HOST_IP], && sed -i s#HOST_IP#$HOST_IP#g /usr/share/nginx/html/main-*.js && exec nginx -g 'daemon off;'"]