'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MigratePage = () => {
  const [migrationLog, setMigrationLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message) => {
    console.log(message);
    setMigrationLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const fixSellerIds = async () => {
    setLoading(true);
    setMigrationLog([]);
    
    try {
      addLog('🚀 Starting seller ID migration...');
      
      // Get all products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      addLog(`📦 Found ${productsSnapshot.docs.length} products`);
      
      // Get all sellers
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const sellers = usersSnapshot.docs
        .filter(doc => doc.data().role === 'seller')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      
      addLog(`👥 Found ${sellers.length} sellers`);
      
      // Batch updates
      const batch = writeBatch(db);
      let updatedCount = 0;
      
      for (const productDoc of productsSnapshot.docs) {
        const productData = productDoc.data();
        const productId = productDoc.id;
        
        // Check current seller ID
        const currentSellerId = productData.sellerId || 
                               productData.userId || 
                               productData.createdBy || 
                               productData.uid;
        
        if (!currentSellerId) {
          addLog(`⚠️ Product "${productData.title}" has no seller ID - skipping`);
          continue;
        }
        
        // Check if current seller ID is valid
        const validSeller = sellers.find(s => s.id === currentSellerId);
        
        if (validSeller) {
          // Update product to ensure sellerId field is set correctly
          if (!productData.sellerId) {
            batch.update(doc(db, 'products', productId), {
              sellerId: currentSellerId,
              updatedAt: new Date().toISOString(),
              migratedAt: new Date().toISOString()
            });
            updatedCount++;
            addLog(`✅ Fixed seller ID for "${productData.title}" -> ${currentSellerId}`);
          } else {
            addLog(`✅ Product "${productData.title}" already has correct seller ID`);
          }
        } else {
          addLog(`❌ Product "${productData.title}" has invalid seller ID: ${currentSellerId}`);
        }
      }
      
      if (updatedCount > 0) {
        await batch.commit();
        addLog(`🎉 Migration completed! Updated ${updatedCount} products`);
      } else {
        addLog('ℹ️ No products needed updating');
      }
      
    } catch (error) {
      addLog(`❌ Migration failed: ${error.message}`);
      console.error('Migration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Migration Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                This tool will fix seller IDs in products by ensuring all products have a proper sellerId field.
              </p>
              <Button 
                onClick={fixSellerIds}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'Running Migration...' : 'Fix Seller IDs'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {migrationLog.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Migration Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                {migrationLog.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MigratePage;
