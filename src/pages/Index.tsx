import { useState, useEffect } from 'react';
import ClientLogin from '@/components/ClientLogin';
import EmployeeLogin from '@/components/EmployeeLogin';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import ClientChat from '@/components/ClientChat';

export default function Index() {
  const [userType, setUserType] = useState<'client' | 'employee' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedType = localStorage.getItem('userType');
    if (savedUser && savedType) {
      setCurrentUser(JSON.parse(savedUser));
      setUserType(savedType as 'client' | 'employee');
    }
  }, []);

  const handleClientLogin = (clientData: any) => {
    setCurrentUser(clientData);
    setUserType('client');
    localStorage.setItem('currentUser', JSON.stringify(clientData));
    localStorage.setItem('userType', 'client');
  };

  const handleEmployeeLogin = (employeeData: any) => {
    setCurrentUser(employeeData);
    setUserType('employee');
    localStorage.setItem('currentUser', JSON.stringify(employeeData));
    localStorage.setItem('userType', 'employee');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    setShowEmployeeLogin(false);
  };

  if (userType === 'employee' && currentUser) {
    return <EmployeeDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (userType === 'client' && currentUser) {
    return <ClientChat client={currentUser} onLogout={handleLogout} />;
  }

  if (showEmployeeLogin) {
    return (
      <EmployeeLogin
        onLogin={handleEmployeeLogin}
        onBack={() => setShowEmployeeLogin(false)}
      />
    );
  }

  return (
    <ClientLogin
      onLogin={handleClientLogin}
      onShowEmployeeLogin={() => setShowEmployeeLogin(true)}
    />
  );
}
