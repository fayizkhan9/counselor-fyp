function setCurrentUser(user) 
{
    localStorage.setItem('currentUser', JSON.stringify(user));
};