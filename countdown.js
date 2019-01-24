

$(document).ready(function() {
    (function($){
        $.extend({
            APP : {    
                formatTimer : function(a) {
                    if (a < 10) {
                        a = '0' + a;
                    }                              
                    return a;
                },
                // demarrage
                startTimer : function(dir) {
                    var a;
                    $.APP.dir = dir;
                
                    $.APP.d1 = new Date();
                    switch($.APP.state) {
                        case 'pause' :
                            // reprendre compteur
                            // extraire horodatage courant (pour calcul) et
                            // soustraire la différence entre l'état pause and actuel
                            $.APP.t1 = $.APP.d1.getTime() - $.APP.td;
                        break;
                        default :
                            // extraire horodatage courant (pour calcul)
                            $.APP.t1 = $.APP.d1.getTime(); 
                            // entrer valeur en secondes et y ajouter millisecondes dans le champ
                            if ($.APP.dir === 'cd') {
                                $.APP.t1 += parseInt($('#cd_seconds').val())*1000;
                            } 
                        break;
                    } 
                    // état de réinitialisation
                    $.APP.state = 'alive';   
                    $('#' + $.APP.dir + '_status').html('En cours');
                    // démarrage boucle minuterie
                    $.APP.loopTimer();
                },
                pauseTimer : function() {
                    // sauvegarde horodatage pause
                    $.APP.dp = new Date();
                    $.APP.tp = $.APP.dp.getTime();
                    // sauvegarde temps écoulé (jusqu'à pause)
                    $.APP.td = $.APP.tp - $.APP.t1;
                    // change valeur du bouton
                    $('#' + $.APP.dir + '_start').val('Resume');
                    // affiche l'état défini
                    $.APP.state = 'pause';
                    $('#' + $.APP.dir + '_status').html('Pause');
                },
                stopTimer : function() {
                    // change valeur du bouton
                    $('#' + $.APP.dir + '_start').val('Restart');               
                    // affiche l'état défini
                    $.APP.state = 'stop';
                    $('#' + $.APP.dir + '_status').html('Arrêt');
                },
                resetTimer : function() {
                    // réinitialisation de l'affichage
                    $('#' + $.APP.dir + '_ms,#' + $.APP.dir + '_s,#' + $.APP.dir + '_m,#' + $.APP.dir + '_h').html('00');
                    // change valeur du bouton
                    $('#' + $.APP.dir + '_start').val('Start');
                    // affiche l'état défini
                    $.APP.state = 'reset';  
                    $('#' + $.APP.dir + '_status').html('Reset & Inactif');
                },
                endTimer : function(callback) {
                    // change valeur bouton
                    $('#' + $.APP.dir + '_start').val('Restart');
                    // affiche l'état 
                    $.APP.state = 'end';
                    // fonction rappel
                    if (typeof callback === 'function') {
                        callback();
                    } 
                }, 
                loopTimer : function() {
                    var td;
                    var d2,t2;
                    var ms = 0;
                    var s  = 0;
                    var m  = 0;
                    var h  = 0;
                    if ($.APP.state === 'alive') {
                        // extrait valeur courante and la transforme  
                        // en horodatage pour calcul
                        d2 = new Date();
                        t2 = d2.getTime();
                        // calcul différence temps entre
                        // valeur initiale et courante
                        if ($.APP.dir === 'sw') {
                            td = t2 - $.APP.t1;
                        // inverser si décompte
                        } else {
                            td = $.APP.t1 - t2;
                            if (td <= 0) {
                                // si valeur à 0, finir décompte
                                $.APP.endTimer(function(){
                                    $.APP.resetTimer();
                                    $('#' + $.APP.dir + '_status').html('Fin & Reset');
                                });
                            }    
                        } 
                        // calcul millisecondes
                        ms = td%1000;
                        if (ms < 1) {
                            ms = 0;
                        } else {    
                            // calcul secondes
                            s = (td-ms)/1000;
                            if (s < 1) {
                                s = 0;
                            } else {
                                // calcul minutes   
                                var m = (s-(s%60))/60;
                                if (m < 1) {
                                    m = 0;
                                } else {
                                    // calcul heures
                                    var h = (m-(m%60))/60;
                                    if (h < 1) {
                                        h = 0;
                                    }                             
                                }    
                            }
                        }
                        // soustrait temps écoulé minutes & heures
                        ms = Math.round(ms/100);
                        s  = s-(m*60);
                        m  = m-(h*60);
                        // mise à jour affichage
                        $('#' + $.APP.dir + '_ms').html($.APP.formatTimer(ms));
                        $('#' + $.APP.dir + '_s').html($.APP.formatTimer(s));
                        $('#' + $.APP.dir + '_m').html($.APP.formatTimer(m));
                        $('#' + $.APP.dir + '_h').html($.APP.formatTimer(h));
                        // loop
                        $.APP.t = setTimeout($.APP.loopTimer,1);
                    } else {
                        // annule boucle minuterie
                        clearTimeout($.APP.t);
                        return true;
                    }  
                }  
            } 
        });
        $('#sw_start').live('click', function() {
            $.APP.startTimer('sw');
        }); 
        $('#cd_start').live('click', function() {
            $.APP.startTimer('cd');
        });
        $('#sw_stop,#cd_stop').live('click', function() {
            $.APP.stopTimer();
        });
        $('#sw_reset,#cd_reset').live('click', function() {
            $.APP.resetTimer();
        });
        $('#sw_pause,#cd_pause').live('click', function() {
            $.APP.pauseTimer();
        });      
    })(jQuery);
});