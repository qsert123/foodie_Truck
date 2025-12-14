import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={`${styles.title} animate-slide-up`}>Gourmet Street Food</h1>
                <p className={`${styles.subtitle} animate-slide-up delay-200`}>Fresh ingredients, bold flavors, served daily.</p>
                <div className={`${styles.actions} animate-slide-up delay-400`}>
                    <Link href="/" className="btn btn-primary">View Menu</Link>

                </div>
            </div>
        </section>
    );
}
