import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { Home, Star, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from 'sonner';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planId: currentPlanId } = useParams();
  const [username, setUsername] = useState('');
  const [plans, setPlans] = useState([]);
  const [showFavorites, setShowFavorites] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPlanDialogOpen, setIsNewPlanDialogOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUsername(currentUser.username || 'User');
    const allPlans = JSON.parse(localStorage.getItem('plans') || '[]');
    const userPlans = allPlans.filter(plan => plan.userId === currentUser.id);
    setPlans(userPlans);
  };

  const toggleFavorite = (planId) => {
    const updatedPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, isFavorite: !plan.isFavorite } : plan
    );
    setPlans(updatedPlans);
    updateLocalStorage(updatedPlans);
  };

  const addNewPlan = () => {
    if (newPlanName.trim()) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const newPlan = {
        id: Date.now(),
        name: newPlanName.trim(),
        isFavorite: false,
        userId: currentUser.id
      };
      const updatedPlans = [...plans, newPlan];
      setPlans(updatedPlans);
      updateLocalStorage(updatedPlans);
      setIsNewPlanDialogOpen(false);
      setNewPlanName('');
      navigate(`/plan/${newPlan.id}`);
    }
  };

  const deletePlan = (planId) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);
    updateLocalStorage(updatedPlans);

    // Remove tasks associated with the deleted plan
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = allTasks.filter(task => task.planId !== planId.toString());
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    toast.success('Plan and associated tasks deleted successfully');

    // If the deleted plan is the current plan, navigate to dashboard
    if (planId.toString() === currentPlanId) {
      navigate('/dashboard');
    } else if (location.pathname === '/dashboard') {
      // If on dashboard, trigger a reload
      window.location.reload();
    }
  };

  const updateLocalStorage = (updatedPlans) => {
    const allPlans = JSON.parse(localStorage.getItem('plans') || '[]');
    const otherUsersPlans = allPlans.filter(plan => plan.userId !== plans[0]?.userId);
    const newAllPlans = [...otherUsersPlans, ...updatedPlans];
    localStorage.setItem('plans', JSON.stringify(newAllPlans));

    if (updatedPlans.length === 0) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const otherUsersTasks = allTasks.filter(task => task.userId !== currentUser.id);
      localStorage.setItem('tasks', JSON.stringify(otherUsersTasks));
    }
  };

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoritePlans = filteredPlans.filter(plan => plan.isFavorite);
  const nonFavoritePlans = filteredPlans.filter(plan => !plan.isFavorite);

  const renderPlanList = (planList) => (
    planList.map(plan => (
      <div key={plan.id} className="flex items-center mb-1 justify-between">
        <div className="flex items-center">
          <Star
            className={`mr-2 cursor-pointer ${plan.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
            size={16}
            onClick={() => toggleFavorite(plan.id)}
          />
          <Link
            to={`/plan/${plan.id}`}
            className="text-gray-600 hover:text-gray-900"
          >
            {plan.name}
          </Link>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deletePlan(plan.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    ))
  );

  return (
    <div className="w-64 bg-white shadow-md p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">My plan of {username}</h2>
      <Link to="/dashboard" className="flex items-center mb-4 text-gray-700 hover:text-gray-900">
        <Home className="mr-2" size={20} />
        Dashboard
      </Link>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center">
            <Star className="mr-2" size={20} />
            Favorite Plans
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        {showFavorites && renderPlanList(favoritePlans)}
      </div>
      <div>
        <h3 className="font-semibold mb-2">All Plans</h3>
        <div className="flex items-center mb-2">
          <Input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow mr-2"
          />
          <Button
            onClick={() => setIsNewPlanDialogOpen(true)}
            className="bg-blue-500 text-white p-2 rounded-full flex-shrink-0"
            size="icon"
          >
            <Plus size={20} />
          </Button>
        </div>
        {renderPlanList(nonFavoritePlans)}
      </div>

      <Dialog open={isNewPlanDialogOpen} onOpenChange={setIsNewPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Enter plan name"
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            className="my-4"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={addNewPlan} disabled={!newPlanName.trim()}>
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;