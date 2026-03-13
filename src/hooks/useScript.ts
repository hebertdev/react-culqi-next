import { useState, useEffect } from 'react';

export type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

export const useScript = (src: string): ScriptStatus => {
  const [status, setStatus] = useState<ScriptStatus>(src ? 'loading' : 'idle');

  useEffect(() => {
    if (!src) {
      setStatus('idle');
      return;
    }

    let script = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      document.head.appendChild(script);
    } else {
      const currentStatus = script.getAttribute('data-status') as ScriptStatus;
      setStatus(
        currentStatus === 'ready'
          ? 'ready'
          : currentStatus === 'error'
            ? 'error'
            : 'loading'
      );
    }

    const setAttributeFromEvent = (event: Event) => {
      script.setAttribute(
        'data-status',
        event.type === 'load' ? 'ready' : 'error'
      );
    };

    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error');
    };

    script.addEventListener('load', setAttributeFromEvent);
    script.addEventListener('error', setAttributeFromEvent);
    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);

    return () => {
      if (script) {
        script.removeEventListener('load', setAttributeFromEvent);
        script.removeEventListener('error', setAttributeFromEvent);
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [src]);

  return status;
};
