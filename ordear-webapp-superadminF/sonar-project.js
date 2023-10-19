const sonarqubeScanner = require ('sonarqube-scanner');

sonarqubeScanner({
    serverUrl : 'http://185.192.96.18:31265/',
    options : {
        'sonar.projectDescription': 'Ordear Sonar Analysis Frontend',
        'sonar.projectName':'ordear-webapp-superadmin',
        'sonar.projectKey':'ordear-webapp-superadmin',
        'sonar.login':'sqp_b1bf65a73d4f440b88946eec3d15815d15d5a34c',
        'sonar.projectVersion':'1.0',
        'sonar.language':'js',
        'sonar.sourceEncoding':'UTF-8',
        'sonar.sources':'.',
    }
},()=>{});