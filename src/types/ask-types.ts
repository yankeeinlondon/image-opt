import { 
  Dictionary, 
  DoesExtend, 
  EmptyObject, 
  ExpandDictionary, 
  If, 
  SimpleToken,
  SimpleType, 
} from "inferred-types";


/**
 * a union of acceptable values for the `type` of a Question
 */
export type QuestionType = 
| "input"
| "number"
| "confirm"
| "list"
| "rawlist"
| "expand"
| "checkbox"
| "password"
| "editor"
| "branch"; // note: "branch" is not an official type

export type Choice<T> = {
  /** 
   * the actual _value_ which the question will be set to if this choice is selected */
  value: T;
  name?: string;
  description?: string;
  short?: string;
  disabled?: boolean | "true" | "false";
}

type BaseQuestionOptions<
  TBaseType,

> = {
  /** the _prompt_ message */
  message: string;
  /** the default value to start with */
  default?: TBaseType;
  /** boolean flag indicating if a value is _required_ from this question */
  required?: boolean;
  /** no idea */
  theme?: unknown;

  /**
   * **requires**
   * 
   * Allows for a question to express which properties in 
   * `Answers` it _requires_ to complete it's task.
   * 
   * For example:
   * ```ts
   * {
   *    requires: {
   *      foo: "number",
   *      bar: "string",
   *      baz: "Opt<number(42,99,0)>"
   *    }
   * }
   * ```
   * 
   * - this means that `foo` and `bar` MUST be defined prior to asking this question
   * - the property `baz` is _optional_ so it's not a requirement but all three 
   * properties will be typed for all appropriate callbacks defined on this question
   */
  requires?: undefined | Record<string, SimpleToken>;

  validate?: (value: TBaseType) => boolean | TBaseType | Promise<TBaseType | boolean>;

}

type InputQuestionOptions = BaseQuestionOptions<string> & {
  /**
  * Transforms the value to display to the user.
  *
  * @param input
  * The input provided by the user.
  *
  * @param answers
  * The answers provided by the users.
  *
  * @param flags
  * Additional information about the value.
  *
  * @returns
  * The value to display to the user.
  */
  transformer?(
    input: any, 
    answers: T, 
    flags: { 
      isFinal?: boolean | undefined 
  }): string | Promise<string>;

  validate?: (value: string) => boolean | string | Promise<string | boolean>;
  theme?: unknown;
}

export type NumberQuestionOptions = BaseQuestionOptions<number> & {
  min?: number;
  max?: number;
  step?: number | 'any';
}

export type PasswordQuestionOptions = BaseQuestionOptions<string> & {
  mask?: boolean | string;
}

export type RawlistQuestionOptions = {
  /** the _prompt_ message */
  message?: string;
  choices?: readonly (string | Choice<unknown>)[];
}

export type ListChoiceOptions = {
  /**
   * A value indicating whether the choice is disabled.
   */
  disabled?: DynamicQuestionProp<boolean | string, Answers> | undefined;
}




/**
 * **Answers**`<T>`
 * 
 * A dictionary of answers where the keys are the values
 * a user chooses between and then the value is what is returned
 * as that value when chosen.
 * 
 * **Note:** the original type didn't not have a generic but thought
 * it might be useful to constrain certain domains of answers. 
 */
export type Answers<T extends string = string> = Record<T, unknown>;



/**
 * **DynamicQuestionProp**`<TValue, TAnswers>`
 * 
 * Either a static value of type `TValue`, a callback or an async callback
 * where the callback is provided `TAnswers` representing the answer to 
 * those questions which have preceded the active question.
 */
export type DynamicQuestionProp<
  TValue,
  TAnswers extends Answers = EmptyObject
> = TValue | Callback<[TAnswers], TValue> | AsyncCallback<[TAnswers],TValue>;


export interface ChoiceOptions {

  type: "choice";

  /**
   * The name of the choice to show to the user.
   */
  name: string;

  /**
   * The value of the choice.
   */
  value?: any;

  /**
   * The short form of the name of the choice.
   */
  short?: string | undefined;

  /**
   * The extra properties of the choice.
   */
  extra?: any;
}





export type Callback<
  TParams extends readonly unknown[],
  TReturn
> = <T extends TParams>(...params: T) => TReturn;

export type AsyncCallback<
  TParams extends readonly unknown[],
  TReturn
> = <T extends TParams>(...params: T) => Promise<TReturn>;



export interface Question<
  TName extends string = string,
  TType extends QuestionType = QuestionType,
  TRequires extends Record<string, SimpleToken> | undefined = Record<string, SimpleToken> | undefined,
> {
  /**
   * The type of the question.
   */
  type: TType;

  /**
   * The "key" in the key/value store (aka, `Answers`) to 
   * which this question's answer will be stored once it is asked.
   */
  name: TName;

  /**
   * A key/value definition of what this question _requires_ when asked
   * as part of a survey. 
   * 
   * ```ts
   * requires: {
   *    name: "string",
   *    age: "number",
   *    favColor: "opt(string)"
   * }
   * ```
   * 
   * This _requires_ that `name` and `age` values are provided _prior_ to 
   * this question being asked. The type of `name` is expected to be "string"
   * and the `age` property is a number.
   * 
   * The property `favColor` is _not_ a strict requirement but will be used by
   * this question if it's available.
   */
  requires?: TRequires;

  /**
   * The message to show to the user.
   */
  message?: DynamicQuestionProp<string, T> | undefined;

  /**
   * The default value of the question.
   */
  default?: DynamicQuestionProp<any, T> | undefined;

  /**
   * The prefix of the {@link message `message`}.
   */
  prefix?: string | undefined;

  /**
   * The suffix of the {@link message `message`}.
   */
  suffix?: string | undefined;

  /**
   * Post-processes the answer.
   *
   * @param input
   * The answer provided by the user.
   *
   * @param answers
   * The answers provided by the user.
   */
  filter?(input: any, answers: T): any;

  /**
   * A value indicating whether the question should be prompted.
   */
  when?: DynamicQuestionProp<boolean, T> | undefined;

  /**
   * Validates the integrity of the answer.
   *
   * @param input
   * The answer provided by the user.
   *
   * @param answers
   * The answers provided by the user.
   *
   * @returns
   * Either a value indicating whether the answer is valid or a {@link String `string`} which describes the error.
   */
  validate?(input: any, answers?: T): boolean | string | Promise<boolean | string>;

  /**
   * Force to prompt the question if the answer already exists.
   */
  askAnswered?: boolean;


  ask: If<
    DoesExtend<TRequires, undefined>,
    () => Answers,
    TRequires extends Record<string, SimpleToken>
    ? <T extends {
      [K in keyof TRequires]: SimpleType<TRequires[K]>
    }>(state: T) => Answers
    : never
  >

}


export type Survey = {
  questions: Question<string, QuestionType, Dictionary | undefined>;

}


export type QuestionOption<T extends QuestionType> = ExpandDictionary<
  Record<"requires", Record<string, SimpleToken> | undefined> & (
    T extends "input"
    ? Omit<InputQuestionOptions, "message">
    : T extends "number"
    ? Omit<NumberQuestionOptions, "message">
    : T extends "confirm"
    ? Omit<ConfirmQuestionOptions, "message">
    : T extends "list"
    ? Omit<ListQuestionOptions, "message">
    : T extends "rawlist"
    ? Omit<RawListQuestionOptions, "message">
    : T extends "expand"
    ? Omit<ExpandQuestionOptions, "message">
    : T extends "checkbox"
    ? Omit<CheckboxQuestionOptions, "message">
    : T extends "password"
    ? Omit<PasswordQuestionOptions, "message">
    : T extends "editor"
    ? Omit<EditorQuestionOptions, "message">
    : T extends "branch"
    ? {}
    : {}
  )

>;


export type DependantQuestion<
  TName extends string,
  TType extends QuestionType,
  TDeps extends Dictionary
> = <T extends TDeps>(state: T) => {}

;
type Req<
  TName extends string,
  TType extends QuestionType,
  TOpt extends QuestionOption<TType>
> = TOpt["requires"] extends undefined
? Question<TName, TType, undefined>
: TOpt["requires"] extends Record<string, SimpleToken> 
  ? Question<
    TName, 
    TType, 
    {
      [K in keyof TOpt["requires"]]: SimpleType<TOpt["requires"][K]>
    }
    >
: never;

/**
 * API surface for starting to ask a question where first choice
 * is what _type_ of question you're asking.
 */
export type AskApiType = {
  input:   <TName extends string, TOpt extends QuestionOption<"input">>(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ) => Req<TName, "input", TOpt>;
  number:  <TName extends string, TOpt extends QuestionOption<"number">>(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ) => Req<TName, "number", TOpt>;
  confirm: <TName extends string, TOpt extends QuestionOption<"confirm">>(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ) => Question<TName>;
  list:    <TName extends string, TOpt extends QuestionOption<"list">>(
    name: TName,
    prompt: string, 
    optOpt?: TOpt
  ) => Question<TName>;
  rawlist: <TName extends string, TOpt extends QuestionOption<"rawlist">>(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ) => Question<TName>;
  expand:  <TName extends string, TOpt extends QuestionOption<"expand">>(
    name: TName,
    prompt: string, 
    opt:TOpt
  ) => Question<TName>;
  checkbox:<TName extends string, TOpt extends QuestionOption<"checkbox">>(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ) => Question<TName>;
  password:<TName extends string, TOpt extends QuestionOption<"password">>(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ) => Question<TName>;
  editor:  <TName extends string, TOpt extends QuestionOption<"editor">>(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ) => Question<TName>;
  branch:  <TName extends string, TOpt extends QuestionOption<"branch">>(
    name: TName,
    prompt: string, 
    opt?:TOpt
  ) => Question<TName>;
}

