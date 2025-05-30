Utilisateur
    SELECT id, id_site, email, password, type, auth FROM users WHERE login = :user AND auth = :auth;
    
    - SELECT id, id_site, email, password, type, auth FROM users WHERE id_site = 11
Site
    SELECT * FROM users INNER JOIN sites ON users.id_site = sites.id WHERE users.id = "'.$_SESSION['id_user']
    SELECT * FROM sites WHERE id = "'.$id_site.'" LIMIT 1

    - SELECT * FROM sites WHERE id=11;
Menu
    SELECT * FROM applications INNER JOIN apps_users ON applications.id = apps_users.id_app WHERE id_user = "'.$_SESSION['id_user'].'" ORDER BY ordre

Pages
    SELECT * FROM pages WHERE titre_url = "'.$page.'" AND id_site = "'.$id_site

    - SELECT * FROM pages WHERE id_site=11

    Stat
        UPDATE pages SET ping = ping+1 WHERE titre_url = "'.$page.'" AND id_site = "'.$id_site