'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { CheckCircle, Lock } from 'lucide-react'

type Plan = 'free' | 'pro'

export default function SubscriptionSection() {
  const [plan, setPlan] = useState<Plan>('free')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleUpgradeClick = () => setShowPaymentModal(true)
  const handleConfirmPayment = () => {
    setPlan('pro')
    setShowPaymentModal(false)
  }

  const renderFeature = (feature: string, isProOnly: boolean) => {
    const available = !isProOnly || plan === 'pro'
    return (
      <div className="flex items-center space-x-2">
        {available ? (
          <CheckCircle className="text-green-500 w-4 h-4" />
        ) : (
          <Lock className="text-gray-400 w-4 h-4" />
        )}
        <span className={`${available ? 'text-gray-800' : 'text-gray-400'} text-sm`}>
          {feature}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="p-6 w-full max-w-lg text-center border rounded-2xl shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">
          Your Plan: {plan.toUpperCase()}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          {plan === 'free'
            ? 'You’re using the Free Plan. Unlock AI formatting and faster downloads by upgrading to Pro.'
            : 'You are on the Pro Plan — enjoy all premium features!'}
        </p>

        <div className="space-y-3 text-left mb-6">
          {renderFeature('Basic document export', false)}
          {renderFeature('AI-powered formatting (Pro)', true)}
          {renderFeature('Faster file downloads (Pro)', true)}
          {renderFeature('Email support', false)}
        </div>

        {plan === 'free' ? (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleUpgradeClick}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
            >
              Upgrade to Pro
            </Button>
          </motion.div>
        ) : (
          <Button disabled className="w-full bg-gray-300 text-gray-700 font-semibold">
            You’re on Pro
          </Button>
        )}

        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md text-left">
            <DialogHeader>
              <DialogTitle>Upgrade to Pro</DialogTitle>
              <DialogDescription>
                Get full access to AI formatting, faster downloads, and more.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4">
              <h3 className="text-lg font-semibold mb-1">Pro Plan - $10/month</h3>
              <p className="text-gray-600 text-sm">Billed monthly, cancel anytime.</p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              >
                Confirm Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}