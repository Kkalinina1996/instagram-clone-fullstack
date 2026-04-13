import styles from "./notFound.module.css";

const NotFound = () => {
  return (
    <section className={styles.page}>
      

      <div className={styles.content}>
        <div className={styles.phones}>
          <img src="/phone.png" alt="app preview" className={styles.phoneBack} />
          <img src="/phone.png" alt="app preview" className={styles.phoneFront} />
        </div>

        <div className={styles.textBlock}>
          <h1>Oops! Page Not Found (404 Error)</h1>
          <p>
            We&apos;re sorry, but the page you&apos;re looking for doesn&apos;t seem to exist.
          </p>
          <p>If you typed the URL manually, please double-check the spelling.</p>
          <p>If you clicked on a link, it may be outdated or broken.</p>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
