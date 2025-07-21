import { supabase } from '../lib/supabase'

const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) {
        alert('구글 로그인 실패: ' + error.message)
        return
    }
}

export default handleGoogleLogin
