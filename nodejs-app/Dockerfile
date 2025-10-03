FROM centos:7

WORKDIR /app

# Atualizar repositórios para o vault (CentOS 7 EOL)
RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-* && \
    sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-* && \
    yum clean all && \
    yum makecache

# Instalar Node.js 16 no CentOS (versão compatível com glibc 2.17)
RUN yum install -y epel-release && \
    curl -sL https://rpm.nodesource.com/setup_16.x | bash - && \
    yum install -y nodejs && \
    yum clean all

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código da aplicação
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]