
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Machine, assign, send, State } from "xstate";
import { useMachine, asEffect } from "@xstate/react";

import { dmMachine } from './dmGame';


//Animation effects
import Confetti from 'react-dom-confetti';
import TextLoop from "react-text-loop";
import { useWindupString } from "windups";



// import { inspect } from "@xstate/inspect";
// inspect({ url:"https://statecharts.io/inspect", iframe: false });


// State machines: ASR-TTS (voice interface) & dmGame
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
const machine = Machine<SDSContext, any, SDSEvent>({
    id: 'root',
    type: 'parallel',
    states: {
        dm: {
            ...dmMachine  //dmGame
        },
        asrtts: {
            initial: 'idle',
            states: {
                idle: {
                    on: {
                        LISTEN: 'recognising',
                        SPEAK: {
                            target: 'speaking',
                            actions: assign((_context, event) => { return { ttsAgenda: event.value } })
                        }
                    }
                },
                recognising: {
                    initial: 'progress',
                    entry: 'recStart',
                    exit: 'recStop',
                    on: {
                        ASRRESULT: {
                            actions: ['recLogResult',
                                assign((_context, event) => { return { recResult: event.value } })],
                            target: '.match'
                        },
                        // TIMEOUT:"..recStop", //mic off so that say() can work
                        RECOGNISED: 'idle'
                    },
                    states: {
                        progress: {
                        },
                        match: {
                            entry: send('RECOGNISED'),
                        },
                    }
                },
                speaking: {
                    entry: 'ttsStart',
                    on: {
                        ENDSPEECH: 'idle',
                    }
                }
            }
        }
    },
},
    {
        actions: {
            recLogResult: (context: SDSContext) => {
                /* context.recResult = event.recResult; */
                console.log('<< ASR: ' + context.recResult);

            },
            test: () => {
                console.log('test')
            },
            logIntent: (context: SDSContext) => {
                /* context.nluData = event.data */
                console.log('<< NLU intent: ' + context.nluData.intent.name)
            }
        },
    });


//COMPONENT: Big button in the middle, with changing texts
interface Props extends React.HTMLAttributes<HTMLElement> {
    state: State<SDSContext, any, any, any>;
    speakingText:string; //Display of ttsAgenda value
}
const ReactiveButton = (props: Props,): JSX.Element => {
    switch (true) {
        case props.state.matches({ asrtts: 'recognising' }):
            return (
                <button type="button" className="glow-on-hover"
                    style={{ animation: "glowing 20s linear"}} {...props}>
                    {/* Listening... */}

                    <TextLoop mask={true} interval={5000} springConfig={{ stiffness: 170, damping: 8 }} >
                        <div><code>{props.speakingText}</code></div>
                        <div><code>...or say Hint, Pass, Restart, Stop </code></div>
                    </TextLoop>

                </button>
            );
        case props.state.matches({ asrtts: 'speaking' }):
            const [spokentext] = useWindupString(props.speakingText); // adds char-by-char animation
            return (
                <button type="button" className="glow-on-hover"
                    style={{ animation: "bordering 1s infinite" }} {...props}>
                    {/* Speaking... */}
                    <code>{spokentext}</code>
                </button>
            );
        default:
            return (
                <button type="button" className="glow-on-hover" {...props}>
                    Play game!
                </button >
            );
    }
}

// //MAIN CONTAINER: React webpage elements & VOI
export default function App() {
    
    //Voice interface events (& console logs)
    const { speak, cancel, speaking } = useSpeechSynthesis({
        onEnd: () => {send('ENDSPEECH') },
    });
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (result: any) => {send({ type: "ASRRESULT", value: result })  },
    });
    const [current, send, service] = useMachine(machine, {
        devTools: true,
        actions: {
            recStart: asEffect(() => {
                console.log('Ready to receive a voice input.');
                listen({
                    interimResults: false,
                    continuous: true
                });
            }),
            recStop: asEffect(() => {
                console.log('Recognition stopped.');
                stop()
            }),
            ttsStart: asEffect((context, effect) => {
                console.log('Speaking...');
                speak({ text: context.ttsAgenda })
            }),
            ttsCancel: asEffect((context, effect) => {
                console.log('TTS STOP...');
                cancel()
            }),
            speak: asEffect((context) => {
	            console.log('Speaking...');
                speak({text: context.ttsAgenda })
            }) 
        }
    });

    // dmMachine context to display on webpage
    const { confettiSwitch } = current.context; //triggers confetti when true
    const { tally } = current.context;
    const { recResult } = current.context;
    const { ttsAgenda } = current.context;
    const { letter } = current.context;
    
    // Config for confetti 
    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 80,
        elementCount: 400,
        dragFriction: 0.12,
        duration: 7500,
        stagger: 1,
        width: "7px",
        height: "7px",
        perspective: "210px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
      };
    
    let clicked=0;
    const handleClick = () =>{ 
        if(clicked===0){
            console.log("clicked")
            send('CLICK')
            clicked=1
        }else{
            console.log("unclicked")
            send('UNCLICK')
            clicked=0
        }
    }

    //JSX codes & various components
    //TODO: how to position components in desired places??
    return (
        <div className="App">
            <div>

                <ReactiveButton speakingText={'😼 '+ttsAgenda} 
                 state={current} onClick={() => {handleClick()}} /> 
                
                <Confetti active={ confettiSwitch } config={ confettiConfig }/>
                 
            </div>

            <div className='YourSubtitles'>    
                            
            <YourLetter letter={letter}/>
            <Scoreboard tally={tally}/>

            <YourSubtitles voiceIn={recResult}/>
            </div>
        
        </div>
    )
};

//COMPONENT: Displaying input of voice interface (ie, recResult)
const YourSubtitles=(props:any) =>{

    // Player's speech-- only displays when recResult!=undefined 
    const voiceIn = props.voiceIn? '😅 '+props.voiceIn : ''

    return(
        <div>
            <h3> {voiceIn} </h3> 
        </div>
    )
}
//COMPONENT: Current score (number & hearts)
const Scoreboard=(props:any) =>{
    // Shows score and hearts when tally>=1 
    const tally = props.tally
    const scoreText = tally? 'Score: '+tally : '' 
    const hearts = tally? '💛'.repeat(tally) : '' 
    return(
        <div>
        <h2><strong>{scoreText}</strong> </h2>
        <h2> <strong>{hearts}</strong> </h2>
        </div>
    )
}

//COMPONENT: Capital letter of the game
const YourLetter=(props:any) =>{
    // Shows the letter of the current game round 
    const letter = props.letter
    return(
        <div>
        <h1>{letter? letter.toUpperCase():''}</h1>
        </div>
    )
}


