# codeChallange-Blackstone
This repo contains a minimal app as requested in a job interview by 'Blackstone', cool name btw.

Regarding the app: I tried to follow a MVC pattern using Mongo Atlas as DB, express as web framework
and plain html/css/js on frontside. The 'code challange' requested some frontend framework, like react,
but i've just started learning it. So, since I'm not comfortable with react yet I went with plain code on front,
I hope that's ok. Anyhow, I'm eager to learn react and pretty much anything! I'm working with Laravel at the
moment, taught me a lot, but I like node very much and I wanna dive deep into it. The repo is on github and
it's deployed using heroku.

Regarding testing: as requested by the 'code challange' testing has been set in place using mocha/chai. In order
to run the tests a '.env' file will be provided with testing credentials, place it on the root folder. Then run the tests, 'npm test'. 
Note: So far I haven't been able to mock session variables in my tests, im ussing 'express-session', so you'll see 3 skipped tests regarding 
the 'Task' controller. I did come up with some alternatives, like using a custom middleware for these routes,
rewriting the backend logic or changing the session package but I felt any of these would defeat the purpose.

Thank you for reading!
