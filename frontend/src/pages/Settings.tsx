import { useGameStore } from '../store/useGameStore'
import { Card } from '../components/UI/Card'
import { NeonButton } from '../components/NeonButton'
import { 
  Shield,
  LogOut
} from 'lucide-react'

export function Settings() {
  const { user, company, logout } = useGameStore()
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading text-slate-200">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>
      
      {/* Profile Settings */}
      <Card title="Profile" subtitle="Your account information">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Display Name</label>
            <input
              type="text"
              value={user?.name || ''}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3">
            <NeonButton color="cyan">
              Save Changes
            </NeonButton>
            <button className="px-4 py-3 bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-800 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </Card>
      
      {/* Company Settings */}
      <Card title="Company" subtitle="Your mining company details">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Company Name</label>
            <input
              type="text"
              value={company?.name || 'My Mining Company'}
              placeholder="Enter company name"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Region</label>
            <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="north-america">North America</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="south-america">South America</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <NeonButton color="cyan">
              Update Company
            </NeonButton>
          </div>
        </div>
      </Card>
      
      {/* Notifications */}
      <Card title="Notifications" subtitle="Manage alert preferences">
        <div className="space-y-4">
          {[
            { id: 'mining', label: 'Mining Alerts', description: 'Rig failures, cooling issues, maintenance' },
            { id: 'trading', label: 'Trading Alerts', description: 'Liquidation warnings, position updates' },
            { id: 'research', label: 'Research Updates', description: 'Completed research, new unlocks' },
            { id: 'governance', label: 'Governance', description: 'New proposals, voting deadlines' },
            { id: 'quests', label: 'Quest Updates', description: 'New quests, completed objectives' }
          ].map((setting) => (
            <div 
              key={setting.id}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">{setting.label}</p>
                <p className="text-xs text-slate-400 mt-1">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Appearance */}
      <Card title="Appearance" subtitle="Customize your interface">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {['Dark', 'Light', 'Auto'].map((theme) => (
                <button
                  key={theme}
                  className={`p-4 rounded-lg border transition-colors ${
                    theme === 'Dark'
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-3">Accent Color</label>
            <div className="flex gap-3">
              {['green', 'blue', 'purple', 'amber'].map((color) => (
                <button
                  key={color}
                  className={`w-12 h-12 rounded-lg bg-${color}-500 hover:ring-2 ring-${color}-400 transition-all`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Security */}
      <Card title="Security" subtitle="Account security settings">
        <div className="space-y-4">
          <button className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-left hover:bg-slate-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Change Password</p>
                <p className="text-xs text-slate-400 mt-1">Update your account password</p>
              </div>
              <Shield className="w-5 h-5 text-slate-400" />
            </div>
          </button>
          
          <button className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-left hover:bg-slate-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400 mt-1">Add an extra layer of security</p>
              </div>
              <span className="text-xs text-amber-400 font-medium">RECOMMENDED</span>
            </div>
          </button>
        </div>
      </Card>
      
      {/* Danger Zone */}
      <Card title="Danger Zone" subtitle="Irreversible actions">
        <div className="space-y-3">
          <button 
            onClick={logout}
            className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left hover:bg-red-500/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Logout</p>
                <p className="text-xs text-slate-400 mt-1">Sign out of your account</p>
              </div>
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
          </button>
          
          <button className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left hover:bg-red-500/20 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Delete Account</p>
                <p className="text-xs text-slate-400 mt-1">Permanently delete your account and all data</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  )
}