const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Loaded Supabase URL:', supabaseUrl);
console.log('Loaded Service Key exists:', !!supabaseServiceKey, supabaseServiceKey?.substring(0, 10));

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables in server/.env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
    
async getUser(email) {
    const { data, error } = await supabase
      .from('users')
      .select('email, name, passwordhash, verified, avatar, active, createdAt')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) return null;

    return {
      email: data.email,
      name: data.name,
      passwordHash: data.passwordhash, // Crucial for bcrypt.compare during login!
      verified: data.verified,
      avatar: data.avatar,
      active: data.active
    };
  },

async createUser({ email, name, passwordHash }) {
    const createdAt = new Date().toISOString();
    
    // Use .select() on insert to return the created row directly
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        email, 
        name, 
        passwordhash: passwordHash, 
        verified: 1, 
        avatar: null, 
        active: 1, 
        createdAt: createdAt 
      }])
      .select()
      .maybeSingle();

    if (error) {
      console.error('createUser error:', error.message);
      throw new Error(error.message);
    }
    
    // Return the formatted user object so it matches what your app expects
    return {
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      active: data.active,
      passwordHash: data.passwordhash // map lowercase column to your app's property name
    };
  },

  async updateUser(email, fields) {
    const dbFields = {};
    if (fields.name !== undefined) dbFields.name = fields.name;
    if (fields.avatar !== undefined) dbFields.avatar = fields.avatar;
    if (fields.active !== undefined) dbFields.active = fields.active;
    if (fields.passwordHash !== undefined) dbFields.passwordhash = fields.passwordHash;

    if (Object.keys(dbFields).length === 0) return this.getUser(email);

    const { error } = await supabase
      .from('users')
      .update(dbFields)
      .eq('email', email);

    if (error) {
      console.error('updateUser error:', error.message);
    }
    return this.getUser(email);
  },

  async deleteUser(email) {
    await supabase.from('users').delete().eq('email', email);
    await supabase.from('otps').delete().eq('email', email);
    await supabase.from('sessions').delete().eq('email', email);
  },

 async setOTP(email, code, expiresAt) {
  const { error } = await supabase
    .from('otps')
    .upsert({ email, code, expires_at: expiresAt }); // Match your exact table column name here

  if (error) {
    console.error('setOTP error:', error.message);
  }
},

async getOTP(email) {
  const { data, error } = await supabase
    .from('otps')
    .select('email, code, expires_at')
    .eq('email', email)
    .maybeSingle();

  if (error || !data) return null;

  return {
    email: data.email,
    code: data.code,
    expiresAt: data.expires_at // Fix: match the column name returned by Supabase
  };
},

  async deleteOTP(email) {
    await supabase.from('otps').delete().eq('email', email);
  },

  async changePassword(email, newHash) {
    return this.updateUser(email, { passwordHash: newHash });
  },

  async deactivateUser(email) {
    return this.updateUser(email, { active: 0 });
  },

  async createSession(id, email, expiresAt) {
    const createdAt = new Date().toISOString();
    const { error } = await supabase
      .from('sessions')
      .insert([{ id, email, expiresat: expiresAt, createdtext: createdAt }]);

    if (error) {
      console.error('createSession error:', error.message);
    }
  },

  async getSession(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from('sessions')
      .select('id, email, expiresat, createdtext')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;

    const row = {
      id: data.id,
      email: data.email,
      expiresAt: data.expiresat,
      createdAt: data.createdtext
    };

    if (Date.now() > row.expiresAt) {
      await this.deleteSession(id);
      return null;
    }
    return row;
  },

  async deleteSession(id) {
    await supabase.from('sessions').delete().eq('id', id);
  }
};