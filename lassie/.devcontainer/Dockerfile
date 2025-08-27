FROM mcr.microsoft.com/devcontainers/python:3.12

# Pull in all the service dependencies
COPY ../eda/requirements.txt ./eda_requirements.txt

COPY ../the-verdict.txt ./the-verdict.txt

# Install service dependencies
RUN pip install -r eda_requirements.txt
