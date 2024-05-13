package projet.conquerantsmobile;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

public class HomeFragment extends Fragment{

    private ImageView companyLogo;
    private ImageView imageProduct1;
    private ImageView imageProduct2;


    public HomeFragment() {

    }

    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        //Source: https://copyprogramming.com/howto/one-fragment-to-another-fragment-on-button-click

        // Inflate the layout for this fragment

        return inflater.inflate(R.layout.fragment_home, container, false);
    }
}