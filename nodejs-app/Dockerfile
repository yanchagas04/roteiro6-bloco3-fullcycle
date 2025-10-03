FROM centos:7

WORKDIR /app

# Instalar Node.js no CentOS
RUN yum install -y epel-release && \
    curl -sL https://rpm.nodesource.com/setup_18.x | bash - && \
    yum install -y nodejs && \
    yum clean all

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código da aplicação
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]