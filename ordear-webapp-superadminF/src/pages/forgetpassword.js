import React, { useEffect, useState } from 'react'
import "../styles/login&signup.css"
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData ,selectError,selectLoading,selectSuccess,selectUser} from '../features/userSlice';
import Loader from '../components/loader';
import { useNavigate } from 'react-router-dom';
import { Toast, Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom'; 
import { useHistory } from 'react-router-dom';


function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled ,setDisabled]= useState(true);
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  const success = useSelector(selectSuccess);
  const user = useSelector(selectUser);

const navigate = useNavigate();
  useEffect(() => {
    const handleSignUp = () => {
      const container = document.querySelector('.container');
      container.classList.add('sign-up-mode');
    };

    const handleSignIn = () => {
      const container = document.querySelector('.container');
      container.classList.remove('sign-up-mode');
    };

    const sign_up_btn = document.querySelector('#sign-up-btn');
    const sign_in_btn = document.querySelector('#sign-in-btn');

    sign_up_btn.addEventListener('click', handleSignUp);
    sign_in_btn.addEventListener('click', handleSignIn);

    return () => {
      sign_up_btn.removeEventListener('click', handleSignUp);
      sign_in_btn.removeEventListener('click', handleSignIn);
    };
  }, []);
 

  // ... (your other useSelector calls)

  const handleForgetPassword = async (e) => {
    e.preventDefault();

    // Add your email validation logic here if needed

    try {
      // Call the forgotPasswordWithCode function using fetch API
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/forgotPwd`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Pass the email in the request body
      });

      const data = await response.json();

      if (response.ok) {
        // Show a success message to the user using toast notification
        toast.success('Password reset email sent! Please check your inbox.');

        // Add any other logic you want after successful email submission

      } else {
        // Handle the error if the response status is not 2xx
        // Show an error message using toast notification
        toast.error('Error sending password reset email.');

        // Add any other error handling logic you want
      }

    } catch (error) {
      // Handle any other errors that may occur during the fetch request
      // Show an error message using toast notification
      toast.error('Error sending password reset email.');

      // Add any other error handling logic you want
    }
  };
  
  useEffect(() => {
if(success)
navigate('/example')
else if(!success && error){
if(error=='Invalid credentials')
toast.error("Invalid credentials")
else if(error=='Invalid email format')
toast.error("Invalid email format")
else if(error=='No account with this email has been founded')
toast.error("No account with this email has been found")
else if(error=='User desactivated')
toast.error("User desactivated")
else if(error=="Cannot read properties of null (reading 'activate')")
toast.error("Account not found")
}
}, [success,error]);


  return (<>
 <Toaster/>
    <div class="container">
      <div class="forms-container">
     

        <div class="signin-signup">
        <form class="sign-in-form" onSubmit={handleForgetPassword}>
        <h2 class="title">Forget Password</h2>
        <div class="input-field">
          <i class="fas fa-user"></i>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input
          type="submit"
          class="btn solid"
          disabled={!email}
          value="Forget Password"
        />
        {/* Add the "Forgot Password" link */}
      </form>
          <form action="#" class="sign-up-form">
            <h2 class="title">SIGN UP</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" placeholder="Username" />
            </div>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input type="email" placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" class="btn" value="Sign up" />
            <p class="social-text">Or Sign up with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div class="panels-container">
        <div class="panel left-panel" style={{marginRight:"100px"}}>
          <div class="content">
            
            <img src='logo.png' style={{height:"300px"}}/> <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
              Debitis,
              ex ratione. Aliquid!
            </p>  
                      <button class="btn transparent" id="sign-up-btn">
              Sign up
            </button>
             
          </div>
          <img src="img/log.svg" class="image" alt="" />
        </div>
        <div class="panel right-panel" style={{marginLeft:"450px"}}>
          <div class="content">
          <img src='logo.png' style={{height:"300px"}}/>
              <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
              Debitis,
              ex ratione. Aliquid!
            </p>
            <button class="btn transparent" id="sign-in-btn">
              Sign in
            </button>
          </div>
          <img src="img/register.svg" class="image" alt="" />
        </div>
      </div>
    </div>
  
  </>
  )
}

export default ForgetPassword