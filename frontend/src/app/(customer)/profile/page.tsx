'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  MapPin, 
  Settings, 
  Plus, 
  Trash2, 
  Shield, 
  Mail, 
  Phone, 
  Home, 
  Briefcase, 
  Info,
  X,
  PlusCircle,
  Building,
  UserCheck
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: string;
  isDefault: boolean;
}

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  primaryRole: string;
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [showAddModal, setShowAddModal] = useState(false);

  // Auto-switch tab on query param
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'addresses') {
        setActiveTab('addresses');
      }
    }
  });

  // Form states for new address
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressType, setAddressType] = useState('HOME');
  const [isDefault, setIsDefault] = useState(false);

  // Fetch profile
  const { data: profileData, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/users/profile');
      return res.data?.data as UserProfile;
    },
  });

  // Fetch addresses
  const { data: addressesData, isLoading: loadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await apiClient.get('/users/addresses');
      return res.data?.data as Address[];
    },
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post('/users/addresses', {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        addressType,
        isDefault,
      });
    },
    onSuccess: () => {
      toast.success('Address added successfully!');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setShowAddModal(false);
      // Reset form
      setFullName('');
      setPhone('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPincode('');
      setAddressType('HOME');
      setIsDefault(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add address');
    },
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/users/addresses/${id}`);
    },
    onSuccess: () => {
      toast.success('Address deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const addresses = addressesData || [];

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 font-display tracking-tight">My Account</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Tabs Sidebar with Slide pill */}
          <div className="md:col-span-1 space-y-2 relative">
            {(['profile', 'addresses'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left z-10 ${
                    isActive
                      ? 'text-white'
                      : 'text-muted-foreground hover:bg-card hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeProfileTab"
                      className="absolute inset-0 bg-primary rounded-xl z-0 shadow-md shadow-primary/15"
                      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    {tab === 'profile' ? <UserIcon className="w-4.5 h-4.5" /> : <MapPin className="w-4.5 h-4.5" />}
                    <span>{tab === 'profile' ? 'Profile Details' : 'Manage Addresses'}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/45 rounded-3xl p-6 md:p-8 shadow-premium-sm space-y-6"
              >
                {/* Header card info */}
                <div className="flex items-center gap-4.5 pb-6 border-b border-border/30">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20 shadow-sm">
                    {profileData?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{profileData?.fullName || 'User Profile'}</h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-3 py-0.5 rounded-full uppercase tracking-wider mt-1.5 border border-primary/15">
                      <UserCheck className="w-3 h-3" />
                      {profileData?.primaryRole || 'CUSTOMER'}
                    </span>
                  </div>
                </div>

                {loadingProfile ? (
                  /* Loading Shimmer details */
                  <div className="space-y-4 animate-pulse">
                    <div className="h-10 bg-muted/40 rounded-xl" />
                    <div className="h-10 bg-muted/40 rounded-xl" />
                  </div>
                ) : (
                  /* Form Grid Details */
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1.5">
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-2 select-none">
                        <Mail className="w-3.5 h-3.5 text-primary" /> 
                        <span>Email Address</span>
                      </span>
                      <p className="text-sm font-bold text-foreground">{profileData?.email}</p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-2 select-none">
                        <Phone className="w-3.5 h-3.5 text-primary" /> 
                        <span>Mobile Number</span>
                      </span>
                      <p className="text-sm font-bold text-foreground">{profileData?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <h2 className="text-xl font-bold text-foreground font-heading">Shipping Addresses</h2>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md transition-all hover:opacity-90 active:scale-[0.96]"
                  >
                    <Plus className="w-4 h-4" /> 
                    <span>Add Address</span>
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-24 bg-muted/40 rounded-2xl" />
                    <div className="h-24 bg-muted/40 rounded-2xl" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="bg-card border border-border/45 rounded-3xl p-10 text-center shadow-premium-sm">
                    <MapPin className="w-12 h-12 text-muted-foreground/35 mx-auto mb-4" />
                    <p className="text-foreground font-bold mb-1">No Addresses Saved Yet</p>
                    <p className="text-xs text-muted-foreground">Add an address to speed up your checkout process.</p>
                  </div>
                ) : (
                  <div className="grid gap-4.5">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-card border border-border/40 rounded-2xl p-5 shadow-premium-sm hover:border-primary/20 transition-all flex justify-between items-start gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted/65 text-muted-foreground flex items-center gap-1 uppercase border border-border/30">
                              {address.addressType === 'HOME' ? <Home className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                              {address.addressType}
                            </span>
                            {address.isDefault && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 uppercase tracking-wide">
                                Default
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-foreground text-base">{address.fullName}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {address.city}, {address.state} - <span className="font-bold text-foreground">{address.pincode}</span>
                          </p>
                          <div className="text-xs text-muted-foreground font-semibold pt-1">
                            Phone: <span className="text-foreground font-bold">{address.phone}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteAddressMutation.mutate(address.id)}
                          className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/15 rounded-xl transition-all hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Address Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowAddModal(false)} 
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border/40 rounded-3xl p-6 shadow-2xl max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh] space-y-6"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-border/40">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Add New Address</span>
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="p-1 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-premium py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-premium py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address Line 1</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House No, Street name, Area"
                    className="w-full input-premium py-2.5 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Landmark, Area, Colony"
                    className="w-full input-premium py-2.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-premium py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="input-premium py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="input-premium py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address Type</label>
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-full input-premium py-2.5 text-sm bg-background border border-border"
                    >
                      <option value="HOME">HOME</option>
                      <option value="WORK">WORK</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-6 pl-2">
                    <input
                      type="checkbox"
                      id="isDefaultCheck"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="form-checkbox w-4.5 h-4.5"
                    />
                    <label htmlFor="isDefaultCheck" className="text-sm font-bold text-muted-foreground select-none cursor-pointer">
                      Set as Default
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-border/40">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-border bg-card text-muted-foreground hover:bg-muted/40 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addAddressMutation.mutate()}
                  disabled={addAddressMutation.isPending}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                >
                  {addAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
