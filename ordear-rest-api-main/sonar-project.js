const sonarqubeScanner = require ('sonarqube-scanner');

sonarqubeScanner({
    serverUrl : 'http://185.192.96.18:31265/',
    options : {
        'sonar.projectDescription': 'Ordear Sonar Analysis Backend',
        'sonar.projectName':'ordear-rest-api',
        'sonar.projectKey':'ordear-rest-api',
        'sonar.login':'sqp_cffe81f2db5c4c1238bdcd5470a309e600e75307',
        'sonar.projectVersion':'1.0',
        'sonar.language':'js',
        'sonar.sourceEncoding':'UTF-8',
        'sonar.sources':'.',
    }
},()=>{});
