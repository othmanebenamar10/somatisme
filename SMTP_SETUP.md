# 📧 CONFIGURATION SMTP POUR VERCEL

## ✅ Configuration SMTP avec Gmail

### Étape 1 : Générer un "App Password" Gmail

1. Allez sur https://myaccount.google.com
2. Cliquez sur "Sécurité" (à gauche)
3. Activez la "Vérification en 2 étapes" si ce n'est pas fait
4. Retournez à "Sécurité" et cherchez "Mots de passe d'application"
5. Sélectionnez "Mail" et "Windows Computer"
6. Générez un mot de passe (16 caractères)
7. **Copiez ce mot de passe** (vous en aurez besoin)

### Étape 2 : Configurer les variables d'environnement sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez le projet "somatisme"
3. Cliquez sur "Settings" (Paramètres)
4. Allez à "Environment Variables"
5. Ajoutez les variables suivantes :

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = somatisme@gmail.com
SMTP_PASS = (le mot de passe d'application généré)
EMAIL_FROM = "SOMATISME" <somatisme@gmail.com>
EMAIL_TO = somatisme@gmail.com
RECAPTCHA_SECRET_KEY = (votre_cle_secrete_google_recaptcha_v3)
```

6. Cliquez "Save" pour chaque variable
7. **Important** : Redéployez le site après avoir ajouté les variables

### Étape 3 : Redéployer sur Vercel

1. Allez à https://vercel.com/dashboard
2. Sélectionnez "somatisme"
3. Cliquez sur "Deployments"
4. Trouvez le dernier déploiement
5. Cliquez sur les "..." et sélectionnez "Redeploy"
6. Attendez que le déploiement soit terminé (2-3 minutes)

### Étape 4 : Tester la configuration

1. Allez sur https://somatisme.vercel.app/contact
2. Remplissez le formulaire de contact
3. Cliquez "Envoyer"
4. Vérifiez que vous recevez un email à `somatisme@gmail.com`

## 🛡️ Configuration reCAPTCHA v3

Le site utilise Google reCAPTCHA v3 pour protéger les formulaires.
1. Accédez à la Google reCAPTCHA Admin Console.
2. Créez une nouvelle clé de type **reCAPTCHA v3**.
3. Ajoutez vos domaines : `somatisme.ma` et `somatisme.vercel.app`.
4. Copiez la **Clé secrète** et ajoutez-la sur Vercel dans la variable `RECAPTCHA_SECRET_KEY`.

## � Sécurité

- ❌ Ne jamais mettre votre mot de passe Gmail réel dans le code
- ✅ Utilisez toujours un "App Password" pour SMTP
- ✅ Les variables d'environnement sur Vercel sont sécurisées
- ✅ Les mots de passe ne sont jamais exposés au client

## 🆘 Dépannage

### L'email n'est pas envoyé
- Vérifiez que les variables d'environnement sont correctement configurées
- Vérifiez que le "App Password" est correct
- Vérifiez que la "Vérification en 2 étapes" est activée sur Gmail
- Attendez 5 minutes après avoir ajouté les variables (cache Vercel)

### Erreur "SMTP connection failed"
- Vérifiez SMTP_HOST = smtp.gmail.com
- Vérifiez SMTP_PORT = 587
- Vérifiez que le "App Password" n'a pas d'espaces

### L'email arrive dans les spams
- Vérifiez que EMAIL_FROM est correct
- Ajoutez un SPF record pour votre domaine
- Configurez DKIM si possible

## 📞 Support

Pour plus d'aide :
- Documentation Gmail : https://support.google.com/accounts/answer/185833
- Documentation Vercel : https://vercel.com/docs/environment-variables
