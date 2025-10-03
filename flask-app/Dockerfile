FROM ubuntu:22.04

# Evitar prompts interativos durante instalação
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Atualizar e instalar Python e pip no Ubuntu
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Instalar dependências Python
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

EXPOSE 5000

# Usar python3 no Ubuntu
CMD ["python3", "app.py"]