use v6;

# start by printing out the header.
say "Tournament Results:\n";

my $file  = open 'scores.txt'; # get filehandle and...
my @names = $file.get.words;   # ... get players.

my %matches;
my %sets;

for $file.lines -> $line {
    next unless $line; # ignore any empty lines

    my ($pairing, $result) = $line.split(' | ');
    my ($p1, $p2)          = $pairing.words;
    my ($r1, $r2)          = $result.split(':');

    %sets{$p1} += $r1;
    %sets{$p2} += $r2;

    if $r1 > $r2 {
        %matches{$p1}++;
    } else {
        %matches{$p2}++;
    }
}

my @sorted = @names.sort({ %sets{$_} }).sort({ %matches{$_} }).reverse;

for @sorted -> $n {
    my $match-noun = %matches{$n} == 1 ?? 'match' !! 'matches';
    my $set-noun   = %sets{$n} == 1 ?? 'set' !! 'sets';
    say "$n has won %matches{$n} $match-noun and %sets{$n} $set-noun";
}

# From https://docs.raku.org/language/101-basics
