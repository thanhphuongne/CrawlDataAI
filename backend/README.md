## Set up server: 

### Run source:
  - Run main service and worker service:
    ````bash
    # Dev mode
    npm run dev
    # Production mode
    npm run prod
    ````
### Docs page:
[API docs](http://localhost:3001/v1/api-docs)

sudo ufw allow 7242

pip install python-dotenv --break-system-packages
pip install boto3 streamlit --break-system-packages

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

chmod +x start_streamlit.sh

pm2 start ./start_streamlit.sh --name streamlit-app

pm2 save

## Automatically create file 'requirements.txt' 
cd dss-be\scripts
pip freeze > requirements.txt ./