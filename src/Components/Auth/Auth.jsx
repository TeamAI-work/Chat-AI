import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Sparkles, Loader2, ArrowRight, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState("")
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const navigate = useNavigate()

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    username,
                    password,
                })
                if (error) throw error
                setMessage('Registration successful! Please check your email for a verification link.')
                const {error:signInError} = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (signInError) throw signInError

                const { data: { user: currentUser } } = await supabase.auth.getUser()
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({
                        user_id: currentUser.id,
                        username: username,
                    })

                if (profileError) throw profileError
                navigate("/")
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                navigate('/') // Navigate back to the app on success
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-theme-bg p-4 relative overflow-hidden font-sans selection:bg-theme-primary/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-theme-primary/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-theme-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                {/* Logo & Headline */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="bg-gradient-to-tr from-theme-primary to-theme-secondary p-3.5 rounded-2xl mb-4 shadow-xl shadow-theme-primary/20 ring-1 ring-white/10">
                        <Sparkles size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-light text-theme-text tracking-wide">
                        {isSignUp ? "Create an Account" : "Welcome Back"}
                    </h1>
                    <p className="text-theme-muted mt-2 text-sm">
                        {isSignUp ? "Join Invixa AI and start building today." : "Log in to access your projects and chats."}
                    </p>
                </div>

                {/* Main Auth Card */}
                <div className="bg-theme-surface/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleAuth} className="space-y-5">

                        {/* Auth Feedback Banners */}
                        <AnimatePresence mode="popLayout">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-sm font-medium"
                                >
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input Fields */}
                        <div className="space-y-4">
                            {
                                isSignUp && (
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={18} className="text-gray-500 group-focus-within:text-theme-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-theme-surface border border-white/5 rounded-xl py-3 pl-11 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-theme-primary/50 focus:border-theme-primary/30 transition-all text-sm"
                                            placeholder="Username"
                                        />
                                    </div>
                                )
                            }
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-500 group-focus-within:text-theme-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-theme-surface border border-white/5 rounded-xl py-3 pl-11 pr-4 dark:text-white text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-theme-primary/50 focus:border-theme-primary/30 transition-all text-sm"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-500 group-focus-within:text-theme-secondary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-theme-surface border border-white/5 rounded-xl py-3 pl-11 pr-4 dark:text-white text-black   placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-theme-secondary/50 focus:border-theme-secondary/30 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-theme-primary to-theme-secondary hover:brightness-110 text-white rounded-xl py-3 font-medium transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 group"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? "Create account" : "Sign in"}
                                    <ArrowRight size={16} className="opacity-70 group-hover:block transition-all group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp)
                                    setError(null)
                                    setMessage(null)
                                    setPassword('')
                                }}
                                className="text-theme-primary hover:text-theme-secondary font-medium transition-colors focus:outline-none"
                            >
                                {isSignUp ? "Sign in" : "Sign up"}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}