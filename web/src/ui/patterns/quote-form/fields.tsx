// Champs du formulaire de soumission : libellé, aide, erreur reliée au champ (accessibilité AA).

type Base = { name: string; label: string; error?: string; optionalLabel?: string; required?: boolean; help?: string };

function Label({ name, label, required, optionalLabel }: Base) {
  return (
    <label htmlFor={name} className="mb-1.5 block text-[15px] font-semibold text-ink">
      {label}
      {!required && optionalLabel && <span className="ms-1.5 font-normal text-ink-3">({optionalLabel})</span>}
    </label>
  );
}

function Help({ name, help, error }: Base) {
  return (
    <>
      {help && <p id={`${name}-help`} className="mt-1.5 text-[14px] text-ink-3">{help}</p>}
      {error && <p id={`${name}-error`} className="mt-1.5 text-[14px] font-semibold text-error">{error}</p>}
    </>
  );
}

const control = "block w-full min-h-12 border-[1.5px] bg-paper px-3 text-[16px] text-ink outline-none focus-visible:border-blue aria-invalid:border-error";
const describedBy = (p: Base) => [p.help && `${p.name}-help`, p.error && `${p.name}-error`].filter(Boolean).join(" ") || undefined;

export function TextField(props: Base & { type?: string; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; maxLength: number }) {
  return (
    <div>
      <Label {...props} />
      <input
        id={props.name}
        name={props.name}
        type={props.type ?? "text"}
        required={props.required}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        maxLength={props.maxLength}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(props)}
        className={`${control} ${props.error ? "border-error" : "border-ink"}`}
      />
      <Help {...props} />
    </div>
  );
}

export function TextArea(props: Base & { maxLength: number }) {
  return (
    <div>
      <Label {...props} />
      <textarea
        id={props.name}
        name={props.name}
        required={props.required}
        rows={6}
        maxLength={props.maxLength}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(props)}
        className={`${control} py-3 ${props.error ? "border-error" : "border-ink"}`}
      />
      <Help {...props} />
    </div>
  );
}

export type Choice = { value: string; label: string };

export function SelectField(props: Base & { options: Choice[]; defaultValue?: string; placeholder: string }) {
  return (
    <div>
      <Label {...props} />
      <select
        id={props.name}
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue ?? ""}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(props)}
        className={`${control} ${props.error ? "border-error" : "border-ink"}`}
      >
        <option value="">{props.placeholder}</option>
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <Help {...props} />
    </div>
  );
}

export function ChoiceGroup(props: Base & { options: Choice[]; type: "radio" | "checkbox"; defaultValue?: string }) {
  return (
    <fieldset aria-describedby={describedBy(props)}>
      <legend className="mb-1.5 text-[15px] font-semibold text-ink">
        {props.label}
        {!props.required && props.optionalLabel && <span className="ms-1.5 font-normal text-ink-3">({props.optionalLabel})</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {props.options.map((o) => (
          <label key={o.value} className="inline-flex min-h-11 cursor-pointer items-center gap-2 border-[1.5px] border-rule px-3 text-[15px] has-checked:border-blue has-checked:bg-paper-2">
            <input type={props.type} name={props.name} value={o.value} defaultChecked={o.value === props.defaultValue} className="size-4 accent-(--bx-blue)" />
            {o.label}
          </label>
        ))}
      </div>
      <Help {...props} />
    </fieldset>
  );
}
