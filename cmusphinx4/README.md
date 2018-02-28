## Acoustic Model Adaptation to improve accuracy [GUIDE] ##

In order to adapt the acoustic model you are required to have sample audio files and their transcription provided. The model can learn by going through the audio files and matching them with the provided transcriptions.

The audio files need to be listed in the `filename.fileids` file while the transcriptions need to be listed in the `filename.transcription` file.


##### List of the short recordings used in this model #####
- parakeet_01.wav
- parakeet_02.wav
- parakeet_03.wav
- parakeet_04.wav
- parakeet_05.wav
- parakeet_06.wav
- parakeet_07.wav
- parakeet_08.wav
- parakeet_09.wav
- parakeet_10.wav


Once you have all your files set up, the learning process is just a series of commands from the SphinxTrain and SphinxBase libraries from cmusphinx.

The following instructions assume acoustic model adaptation for the Sphinx4 Java library.

The `sphinx_fe` command from SphinxBase converts your .wav files to mfc files. They are acoustic model feature files required in order to run the adaptation tools

`sphinx_fe -argfile en-us/feat.params -samprate 16000 -c parakeet.fileids -di . -do . -ei wav -eo mfc -mswav yes` 

Next step is to collect data from these newly converted files useing the `bw` command from SphinxTrain.

`bw  -hmmdir en-us  -moddeffn en-us/mdef.txt  -ts2cbfn .ptm.  -feat 1s_c_d_dd  -svspec 0-12/13-25/26-38  -cmn current  -agc none  -dictfn cmudict-en-us.dict  -ctlfn parakeet.fileids  -lsnfn parakeet.transcription  -accumdir . `

Before we update the acoustic model, lets make a copy so that we make a new model instead of replacing the original. Assuming we are changing the English model:

`cp -a en-us en-us-adapt`

Now we can apply the adaptations using `map_update`.

`map_adapt    -moddeffn en-us/mdef.txt     -ts2cbfn .ptm.     -meanfn en-us/means     -varfn en-us/variances     -mixwfn en-us/mixture_weights     -tmatfn en-us/transition_matrices     -accumdir .     -mapmeanfn en-us-adapt/means     -mapvarfn en-us-adapt/variances     -mapmixwfn en-us-adapt/mixture_weights     -maptmatfn en-us-adapt/transition_matrices`

Congratulations... you now have a updated acoustic model that should improve you accuracy. To use this model pass the path to the `en-us-adapt` directory as our new acoustic model.


