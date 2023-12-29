@echo off

REM Ajout de la plateforme Android
ionic capacitor add android || echo Erreur lors de l'ajout de la plateforme Android, mais l'exécution se poursuit

REM Synchronisation avec Capacitor
ionic capacitor sync android || echo Erreur lors de la synchronisation avec Capacitor, mais l'exécution se poursuit

REM Construction du projet Android
ionic build android || echo Erreur lors de la construction du projet Android, mais l'exécution se poursuit

REM Changement du répertoire vers le dossier Android
cd android

REM Création du fichier local.properties
echo sdk.dir=C:/Users/Tita/AppData/Local/Android/Sdk > local.properties

REM Assemblage du projet (assembleDebug)
gradlew assembleDebug || echo Erreur lors de l'assemblage du projet (assembleDebug), mais l'exécution se poursuit

REM Revenir au répertoire initial si nécessaire
cd ..