import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Mail, Lock , Facebook, GanttChartSquare,EyeOff,Eye} from 'lucide-react';



export default function Login({ onLogin }: { onLogin: () => void }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      toast.success('Login successful! 🎉');
      onLogin();
      setTimeout(() => navigate('/users'), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed ❌');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <Mail style={styles.icon} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          {/* Password */}
         <div style={styles.inputGroup}>
  <label style={styles.label}>Password</label>
  <div style={styles.inputWrapper}>
    <Lock style={styles.icon} />
    <input
      name="password"
      type={showPassword ? 'text' : 'password'}
      value={form.password}
      onChange={handleChange}
      style={styles.input}
      placeholder="Enter password"
      required
    />
    {/* Toggle eye icon */}
    <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </div>
  </div>
</div>


          <button type="submit" style={styles.primaryButton}>Sign In</button>
        </form>
        <div style={styles.switchForm}>
          Don't have an account? <a href="/register" style={styles.link}>Register</a>
        </div>
      <div style={styles.divider}>
  <hr style={styles.hr} />
  <span style={styles.dividerText}>or connect with</span>
  <hr style={styles.hr} />
</div>


<div style={styles.socialRow}>
  
<button style={{ ...styles.socialButton, backgroundColor: '#DB4437' }}>
    <GanttChartSquare size={18} style={{ marginRight: 8 }} />
    Google
  </button>
  <button style={{ ...styles.socialButton, backgroundColor: '#4267B2' }}>
    <Facebook size={18} style={{ marginRight: 8 }} />
    Facebook
  </button>

  
</div>


      </div>
      
    </div>
    
  );
}


const styles: { [key: string]: React.CSSProperties } = {
  socialRow: {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
  gap: '10px',
},
socialButton: {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '14px',
},
divider: {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  margin: '20px 0',
},

dividerText: {
  color: 'lightblue',
  fontSize: '14px',
  fontWeight: 'bold',
 
  whiteSpace: 'nowrap',
},

hr: {
  flex: 1,
  height: '1px',
  backgroundColor: '#ccc',
  border: 'none',
},

  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  eyeIcon: {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#9ca3af',
  cursor: 'pointer',
},

  label: {
    fontSize: '14px',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: '16px',
  },
  input: {
    padding: '10px 10px 10px 35px', // Left padding for icon
    border: '1px solid #d1d5db',
    borderRadius: '5px',
    fontSize: '15px',
    width: '100%',
  },
  primaryButton: {
    padding: '12px',
    backgroundColor: '#4F46E5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  switchForm: {
    textAlign: 'center',
    marginTop: '15px',
    color: '#6b7280',
    fontSize: '14px',
  },
  link: {
    color: '#4F46E5',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};

